#!/usr/bin/gsi-script

(include "obj-loader.scm")

(define name (cadr (command-line)))

(define obj (obj-load name #f #t))

(define (print-vertex vertex)
  (print "$V(["
         (car vertex)
         ","
         (cadr vertex)
         ","
         (caddr vertex)
         "])"))

(define (random-int upper)
  (inexact->exact (floor (* (random-real) upper))))

(with-output-to-file (string-append name ".js")
  (lambda ()

    (print "var tris = [")

    (for-each (lambda (chunk)
                (let loop ((lst (reverse (obj-chunk-indices chunk))))
                  (if (not (null? lst))
                      (begin

                        (print "make_triangle([")
                        (print-vertex (lookup-vertex obj (car lst)))
                        (print ",")
                        (print-vertex (lookup-vertex obj (cadr lst)))
                        (print ",")
                        (print-vertex (lookup-vertex obj (caddr lst)))
                        (print "], "
                               (random-int 255)
                               ","
                               (random-int 255)
                               ","
                               (random-int 255)
                               "),\n")


                        (loop (cdddr lst))))))
              (obj-chunks obj))

    (print "]")))

